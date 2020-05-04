const escape = function(string){
  var text = document.createTextNode(string);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}
