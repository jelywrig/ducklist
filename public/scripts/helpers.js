const escape = function(string){
  var text = document.createTextNode(string);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

const displayDate = function(dateString) {
  const date = new Date(dateString);
  // Milliseconds Passed
  const msPassed = new Date() - date;
  const minPassed = msPassed / (1000 * 60);
  if (minPassed < 60) {
    return `${Math.round(minPassed)} min ago`;
  }
  const hoursPassed = minPassed / 60;
  if (hoursPassed < 24) {
    return `${Math.round(hoursPassed)} hours ago`
  }
  const daysPassed = Math.round(hoursPassed / 24);
  if (daysPassed === 1) {
    return 'Yesterday'
  } else {
    return `${daysPassed} days ago`
  }
}
