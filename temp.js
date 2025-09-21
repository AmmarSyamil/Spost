divs.forEach(div => {
  if (div.hasAttribute("data-pagelet")) {
    console.log("Found div with pagelet:", div);
  }
});

''
const foundDivs = document.querySelectorAll("div[data-pagelet]");

if (foundDivs.length > 0) {
  console.log(`Found ${foundDivs.length} div(s) with data-pagelet:`);
  foundDivs.forEach(div => 
    console.log(div.getAttribute("data-pagelet"), div)
  );
} else {
  console.log("No divs with data-pagelet found.");
}


main page:
story_tray
IGDChatTabsRootContent

explore:
IGDChatTabsRootContent

reels:
IGDChatTabsRootContent


