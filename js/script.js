// автокомплит по городам
const Autocomplete = (selector, data) => {

    let inputs = document.querySelectorAll(selector);
  
    function ciSearch(what = '', where = '') {
      return where.toUpperCase().search(what.toUpperCase());
    }
    
    inputs.forEach(input => {
  
      input.classList.add('autocomplete-input');
      let wrap = document.createElement('div');
      wrap.className = 'autocomplete-wrap';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
  
      let list = document.createElement('div');
      list.className = 'autocomplete-list';
      wrap.appendChild(list);
  
      let matches = [];
      let listItems = [];
      let focusedItem = -1;
  
      function setActive(active = true) {
        if(active)
          wrap.classList.add('active');
        else
          wrap.classList.remove('active');
      }
  
      function focusItem(index) {
        if(!listItems.length) return false;
        if(index > listItems.length - 1) return focusItem(0);
        if(index < 0) return focusItem(listItems.length - 1);
        focusedItem = index;
        unfocusAllItems();
        listItems[focusedItem].classList.add('focused');
      }
      function unfocusAllItems() {
        listItems.forEach(item => {
          item.classList.remove('focused');
        });
      }
      function selectItem(index) {
        if(!listItems[index]) return false;
        input.value = listItems[index].innerText;
        setActive(false);
      }
  
      input.addEventListener('input', () => {
  
        let value = input.value;
        if(!value) return setActive(false);
  
        list.innerHTML = '';
        listItems = [];
  
        data.forEach((dataItem, index) => {
  
          let search = ciSearch(value, dataItem.city);
          if(search === -1) return false;
          matches.push(index);
  
          let parts = [
            (dataItem.city).substr(0, search),
            (dataItem.city).substr(search, value.length),
            (dataItem.city).substr(search + value.length, (dataItem.city).length - search - value.length)
          ];
  
          let item = document.createElement('div');
          item.className = 'autocomplete-item';
          item.innerHTML = parts[0] + '<strong>' + parts[1] + '</strong>' + parts[2];
          list.appendChild(item);
          listItems.push(item);
  
          item.addEventListener('click', function() {
            selectItem(listItems.indexOf(item));
          });
  
        });
  
        if(listItems.length > 0) {
          focusItem(0);
          setActive(true);
        }
        else setActive(false);
  
      });
  
      input.addEventListener('keydown', e => {
  
        let keyCode = e.keyCode;
  
        if(keyCode === 40) { // arrow down
          e.preventDefault();
          focusedItem++;
          focusItem(focusedItem);
        } else if(keyCode === 38) { //arrow up
          e.preventDefault();
          if(focusedItem > 0) focusedItem--;
          focusItem(focusedItem);
        } else if(keyCode === 27) { // escape
          setActive(false);
        } else if(keyCode === 13) { // enter
          selectItem(focusedItem);
        }
        
      });
  
      document.body.addEventListener('click', function(e) {
        if(!wrap.contains(e.target)) setActive(false);
      });
  
    });
  
  }

// вывод погоды по заданному городу
var button = document.querySelector('.submit');
var input = document.querySelector('.input_city');
var main = document.querySelector('#name');
var temp = document.querySelector('.temp');
var wind = document.querySelector('.wind');
var pressure = document.querySelector('.pressure');

button.addEventListener('click', function(name) {
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input.value + '&units=metric&appid=6e2b599a4fa06e47ba5cf31e33132d55')
  .then(response => response.json())
  .then(data => {

    var nameValue = input.value;
    var tempValue = data['main']['temp'];
    var windValue = data['wind']['speed'];
    var pressureValue = data['main']['pressure'];

    main.innerHTML = nameValue;
    temp.innerHTML = "Температура: " + tempValue + " С°";
    wind.innerHTML = "Ветер: " + windValue + " м/с";
    pressure.innerHTML = "Давление: " + pressureValue + " мм";
    input.value = "";
    
  })
  .catch(err => alert("Не удалось получить данные о погоде в данном городе."))
});