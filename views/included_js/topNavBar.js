/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function showHideTopMenu() {
  var x = document.getElementById("main_page_nav_bar");
  if (x.className === "top_nav_bar") {
    x.className += " responsive";
  } else {
    x.className = "top_nav_bar";
  }
}