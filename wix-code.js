// home page
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { local } from 'wix-storage';

$w.onReady(function () {
  $w('#searchButton').onClick(handleSearch);
});

function handleSearch() {
  let address = $w('#address').value;
  let priceFrom = parseInt($w('#priceFrom').value, 10) || 0;
  let priceTo = parseInt($w('#priceTo').value, 10) || 999999;
  let numberOfRooms = parseInt($w('#numberOfRooms').value, 10) || 0;
  let numberOfGuests = parseInt($w('#numberOfGuests').value, 10) || 0;

  wixData.query('properties')
    .contains('address', address)
    .ge('price', priceFrom)
    .le('price', priceTo)
    .ge('number_of_room', numberOfRooms)
    .ge('number_of_guest', numberOfGuests)
    .find()
    .then(data => {
      local.setItem('properties', JSON.stringify(data.items));
      wixLocation.to('/real-estate');
    });

}


// list page
import { local } from 'wix-storage';

const PAGE_PROPERTIES_COUNT = 3;

let properties;
let pagesCount;
let currentPage = 1;

$w.onReady(function () {
  setProperties();
  setPaginationButtonsListeners();
});

function setProperties() {
  properties = JSON.parse(local.getItem('properties'));

  setPagesCount();

  setElementsVisibility();

  setPropertiesData(properties.slice(0, PAGE_PROPERTIES_COUNT));
}

function setPagesCount() {
  pagesCount = Math.ceil(properties.length / PAGE_PROPERTIES_COUNT);
}

function setElementsVisibility() {
  let visiblePropertiesCount = getVisiblePropertiesCount();

  if (pagesCount > 1) {
    showPaginationButtons(pagesCount, currentPage);
  }

  if (visiblePropertiesCount === 0) {
    showNoResultsLabel();
  }

  hidePropertyItems(PAGE_PROPERTIES_COUNT - visiblePropertiesCount);

}

function getVisiblePropertiesCount() {
  return pagesCount === 0 || pagesCount === currentPage ? properties.length - (currentPage - 1) * PAGE_PROPERTIES_COUNT : PAGE_PROPERTIES_COUNT;
}

function showPaginationButtons() {
  $w('#paginationButtons').show();

  $w('#prevButton').enable();
  $w('#nextButton').enable();

  if (currentPage === 1) {
    $w('#prevButton').disable();
  } else if (currentPage === pagesCount) {
    $w('#nextButton').disable();
  }
}

function showNoResultsLabel() {
  $w('#noResults').show();
}

function hidePropertyItems(count) {
  showPropertyItems();

  for (let i = 0; i < count; i++) {
    $w(`#group${PAGE_PROPERTIES_COUNT - i}`).hide();
  }
}

function showPropertyItems() {
  for (let i = 1; i <= PAGE_PROPERTIES_COUNT; i++) {
    $w(`#group${i}`).show();
  }
}

function setPropertiesData(properties) {
  properties.forEach((property, index) => {
    $w(`#title${index}`).text = property.title;
    $w(`#description${index}`).text = property.description;
    $w(`#image${index}`).src = property.image;
    $w(`#address${index}`).text = property.address;
    $w(`#price${index}`).text = property.price;
  });
}

function setPaginationButtonsListeners() {
  $w('#prevButton').onClick(handlePrev);
  $w('#nextButton').onClick(handleNext);
}

function handlePrev() {
  currentPage -= 1;
  setElementsVisibility();
  setPropertiesData(properties.slice((currentPage - 1) * PAGE_PROPERTIES_COUNT, PAGE_PROPERTIES_COUNT * currentPage));
}

function handleNext() {
  currentPage += 1;
  setElementsVisibility();
  setPropertiesData(properties.slice((currentPage - 1) * PAGE_PROPERTIES_COUNT, PAGE_PROPERTIES_COUNT * currentPage));
}
