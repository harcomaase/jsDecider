var options = [];
loadHistory();

/**
 * Add a new option to the list
 */
function addOption() {
  var optElement = document.getElementById('option_input');
  var opt = optElement.value;
  if (!opt || opt.length < 1) {
    alert('no valid option entered');
    return;
  }

  if (options.indexOf(opt) >= 0) {
    alert('value already in list');
    return;
  }

  options.push(opt);
  showOptions();

  optElement.value = '';
}

/**
 * Do roll and get decision
 */
function roll() {
  var opt = Math.floor(Math.random() * options.length);
  var result = options[opt];

  var overlay = document.createElement("div");
  overlay.classList.add('overlay');
  overlay.onclick = hideResult;
  document.getElementById('result_showing').appendChild(overlay);

  var box = document.createElement("div");
  box.classList.add('resultBox');
  box.onclick = hideResult;
  overlay.appendChild(box);

  var res = document.createElement("div");
  res.textContent = result;
  res.style.fontSize = '2em';
  res.onclick = hideResult;
  box.appendChild(res);

  var hint = document.createElement("div");
  hint.textContent = '(click anywhere to close this dialog)';
  hint.style.color = 'black';
  hint.style.fontSize = '0.8em';
  hint.style.fontWeight = 'normal';
  hint.style.marginTop = '15px';
  box.appendChild(hint);

  storeOptions();
}

/**
 * Remove an option from the list
 */
function removeOption() {
  var index = options.indexOf(this.textContent);
  if (index > -1) {
    options.splice(index, 1);
  }
  showOptions();
}

/**
 * Show options list in UI
 */
function showOptions() {
  var opts = document.getElementById('option_showing');
  removeChildNodes(opts);

  if (options.length > 0) {
    var label = document.createElement('span');
    label.textContent = 'entered options: ';
    opts.appendChild(label);
  }

  var rollButton = document.getElementById('roll_button');
  if (options.length === 0 !== rollButton.classList.contains('pure-button-disabled')) {
    rollButton.classList.toggle('pure-button-disabled');
    rollButton.onclick = rollButton.classList.contains('pure-button-disabled') ? null : roll;
  }

  for (var n = 0; n < options.length; n++) {
    var opt = options[n];
    var optDiv = document.createElement('button');
    optDiv.classList.add('pure-button');
    optDiv.style.margin = '5px';
    optDiv.textContent = opt;
    optDiv.onclick = removeOption;
    opts.appendChild(optDiv);
  }
}

/**
 * Hide result ;)
 */
function hideResult() {
  removeChildNodes(document.getElementById('result_showing'));
}

function removeChildNodes(parentNode) {
  var removeUs = [];
  for (var n = 0; n < parentNode.childNodes.length; n++) {
    var node = parentNode.childNodes[n];
    removeUs.push(node);
  }
  for (var n = 0; n < removeUs.length; n++) {
    parentNode.removeChild(removeUs[n]);
  }
  removeUs = null;
}

/**
 * Store options list in the local storage
 */
function storeOptions() {
  var opts = options.join(',');

  var currentStoredOptions = localStorage.getItem('history');
  if (!currentStoredOptions) {
    currentStoredOptions = '';
  } else {
    currentStoredOptions += ";";
  }
  var alreadyContainedIndex = currentStoredOptions.indexOf(opts);
  if (alreadyContainedIndex > -1) {
    currentStoredOptions = currentStoredOptions.substring(0, alreadyContainedIndex) + currentStoredOptions.substring(alreadyContainedIndex + opts.length + 1);
  }
  currentStoredOptions += opts;
  localStorage.setItem('history', currentStoredOptions);

  loadHistory();
}

/**
 * Load and show history of recent options
 */
function loadHistory() {
  var histDiv = document.getElementById('history_showing');
  removeChildNodes(histDiv);
  var history = localStorage.getItem('history');
  if (!history || history === null) {
    return;
  }
  var entries = history.split(';');
  if (entries.length === 0) {
    return;
  }

  var fieldset = document.createElement('fieldset');
  histDiv.appendChild(fieldset);
  var hint = document.createElement('legend');
  hint.textContent = 'Recent options:';
  fieldset.appendChild(hint);

  for (var n = entries.length - 1; n >= 0; n--) {
    var entry = entries[n];
    var e = document.createElement('button');
    e.textContent = entry.split(',').join(', ');
    e.classList.add('pure-button');
    e.style.backgroundColor = 'rgb(66, 184, 221)';
    e.style.marginRight = '5px';
    e.onclick = loadOptionsFromHistory;
    fieldset.appendChild(e);
  }

  var clearButton = document.createElement('button');
  clearButton.textContent = 'clear history';
  clearButton.classList.add('pure-button');
  clearButton.onclick = clearHistory;
  fieldset.appendChild(clearButton);
}

/**
 * Clear history ;)
 */
function clearHistory() {
  localStorage.removeItem('history');
  loadHistory();
}

/**
 * Load options from the history
 */
function loadOptionsFromHistory() {
  options = this.textContent.split(',');
  showOptions();
}
