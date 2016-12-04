function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

$('#twitter-analysis').click(function() {
  window.location.href = `/api/${strip($('#twitter-handle')[0].value)}`;
});
