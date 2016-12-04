var socket = io();

socket.on('returnHome', function (data) {
  window.location.href = "/err";
});

socket.on('updateData', function (data) {

  var users = data.data;

  if(typeof users != 'undefined' && users.length>0)
  {
    var table = document.createElement("TABLE");
    table.border = "1";
    table.className = "table table-striped"

    // Add the header row
    var cols = Object.keys(users[0]);
    var row = table.insertRow(-1);
    for (var i = 0; i < cols.length; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = cols[i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
   for (var i = 0; i < users.length; i++) {
       row = table.insertRow(-1);
       for (var j = 0; j < cols.length; j++) {
           var cell = row.insertCell(-1);
           cell.innerHTML = users[i][cols[j]];
       }
   }

   // Add the table to the div
   var dvTable = document.getElementById("table-container");
   dvTable.innerHTML = "";
   dvTable.appendChild(table);

  }
});

socket.on('setUpdateText', function (data) {
    $("#statusText").text(`${data.text}.  ${data.num_follows} followers remaining to download.`);
});
