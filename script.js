var queryString = new URLSearchParams(window.location.search);
// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei_xml = queryString.get('folio')
let extension = ".xml";
let folder_xml = "xml/";
let folio_xml = folder_xml.concat(tei_xml.concat(extension));
let pageN = queryString.get('page');
let number = Number(pageN);

let title = document.getElementById('folio');
title.textContent = queryString.get('folio');

if(pageN == "44"){
	document.getElementById("backButton").disabled = true;
}

if(pageN == "53"){
	document.getElementById("nextButton").disabled = true;
}


// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
	  
		if((criticalElement.getElementsByTagName("note")).length == 0) {
			document.getElementById("notesButton").style.visibility = "hidden";
		}
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  function highlightGreen(item) {
	  item.style.backgroundColor = "green";
  }
  
  function removeHighlight(item) {
	item.style.backgroundColor = "white";
  }
  
    function highlightRed(item) {
	  item.style.backgroundColor = "red";
  }
  
  function hideElement(item){
	  item.style.display = "none";
  }
  
  function showElement(item) {
	  item.style.display = "inline";
  }
  
  function removeStyling(item){
	  item.removeAttribute('style');
	  item.style.verticalAlign = "initial";
	  item.style.fontSize = "100%";
	  item.style.position = "static";
	  item.style.fontWeight = "normal";
  }
  

  // Initial document load
  documentLoader();
  statsLoader();
  
  // Event listener for sel1 change
  function selectHand(event) {
	del = document.getElementsByTagName("del");
	add = document.getElementsByTagName("span");
	
	var MaryDel = Array();
	var PercyDel = Array();
	
	for(let i = 0; i < del.length;i++){
		(del[i].getAttribute("class") == "#MWS")?MaryDel.push(del[i]):PercyDel.push(del[i]);
	}
	
	var MaryAdd = Array();
	var PercyAdd = Array();
	
	for(let i = 0; i < add.length;i++) {
	  let x = add[i].getAttribute("class");
	  console.log(x);
	  if (x == "supraAdd" | x == "marginAdd" | x == "add"){
		  console.log("I'm adding.")
		  if(add[i].getAttribute("auth") == "#MWS"){
			MaryAdd.push(add[i]);
		  } else if (add[i].getAttribute("auth") == "#PBS") {
			PercyAdd.push(add[i]);
		  } else {
		  }
	  }
	}
  //var visible_mary = document.getElementsByTagName("add del").getElementsByClassName('#MWS');
  //var visible_percy = document.getElementsByClassName('#PBS');
  // Convert the HTMLCollection to an array for forEach compatibility
  //var MaryArray = Array.from(visible_mary);
  //var PercyArray = Array.from(visible_percy);
    if (event.target.value == 'both') {
    //write an forEach() method that shows all the text written and modified by both hand (in black?). The forEach() method of Array instances executes a provided function once for each array element.
		MaryDel.forEach(highlightRed);
		MaryAdd.forEach(highlightGreen);
		PercyDel.forEach(highlightRed);
		PercyAdd.forEach(highlightGreen);
    } else if (event.target.value == 'Mary') {
     //write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
		MaryDel.forEach(highlightRed);
		MaryAdd.forEach(highlightGreen);
		PercyDel.forEach(removeHighlight);
		PercyAdd.forEach(removeHighlight);
    } else if (event.target.value == 'neither') {
		MaryDel.forEach(removeHighlight);
		MaryAdd.forEach(removeHighlight);
		PercyDel.forEach(removeHighlight);
		PercyAdd.forEach(removeHighlight);
	}else {
     //write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
		MaryDel.forEach(removeHighlight);
		MaryAdd.forEach(removeHighlight);
		PercyDel.forEach(highlightRed);
		PercyAdd.forEach(highlightGreen);
    }
  }
  

// write another function that will toggle the display of the deletions by clicking on a button
function toggleDeletions (){
	console.log("Button Click!")
	var del = Array.from(document.getElementsByTagName("del"));
	del.forEach(function(item){
		if(item.style.display == "none") {
			item.style.display = "inline";
			document.getElementById("deletionsButton").innerHTML = "Hide Deletions";
		} else {
			item.style.display = "none";
			document.getElementById("deletionsButton").innerHTML = "Show Deletions";
		}
	});
}

var pages = [44,45,46,47,48,49,50,51,52,53]
var folios = ["21r","21v","22r","22v","23r","23v","24r","24v","25r","25v"];

function previousPage(){
	let prevPage = parseInt(pageN) - 1;
	if(prevPage < 44) { return } //Not the most robust way of doing this, but for this project, it will do.
	let index = folios.findIndex((item) => item == tei_xml);
	if(index == 0) { return } //Should be redundant after the above check, but just in case.
	let prevFolio = folios[index - 1];
	
	window.location.replace("pageviewer.html?page=" + prevPage + "&folio=" + prevFolio);
}

function nextPage() {
	let nxtPage = parseInt(pageN) + 1;
	if(nxtPage > 53) { return } //Not the most robust way of doing this, but for this project, it will do.
	let index = folios.findIndex((item) => item == tei_xml);
	console.log(index);
	if(index == 9) { return } //Should be redundant after the above check, but just in case.
	let nxtFolio = folios[index + 1];
	
	window.location.replace("pageviewer.html?page=" + nxtPage + "&folio=" + nxtFolio);
}

function changePage(event){
	let index = folios.findIndex((item) => item == event.target.value);
	
	window.location.replace("pageviewer.html?page=" + pages[index] + "&folio=" + folios[index]);
}
//select the correct item in the dropdown menu when we load the page.
(Array.from(document.getElementById("sel-page"))).forEach(function(item){
	if(item.value == tei_xml) { item.selected = true; }
});

function toggleNotes() {
	var note = Array.from(document.getElementsByTagName("note"));
	let btnHTML = document.getElementById("notesButton").innerHTML;
	note.forEach(function(item){
		if(btnHTML == "Show Notes") { //Rather awkward workaround to fix a bug where the first button click won't do anything. Will break if the inner HTML is changed in pageviewer.html
			item.style.display = "inline";
			document.getElementById("notesButton").innerHTML = "Hide Notes";
		} else {
			item.style.display = "none";
			document.getElementById("notesButton").innerHTML = "Show Notes";
		}
	});
	
	/*
	note.forEach(function(item){
		if(item.style.display == "none") {
			item.style.display = "inline";
			document.getElementById("notesButton").innerHTML = "Hide Notes";
		} else {
			item.style.display = "none";
			document.getElementById("notesButton").innerHTML = "Show Notes";
		}
	});*/
}


// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)

var reader = false;

function readerMode(){
	if(reader){
		location.reload();
		return;
	}
	document.getElementById("readerButton").innerHTML = "Leave Reader Mode";
	document.getElementById("sel-hand").disabled = true;
	document.getElementById("deletionsButton").disabled = true;
	document.getElementById("notesButton").disabled = true;
	
	
	
	del = Array.from(document.getElementsByTagName("del"));
	overwrittenDel = Array.from(document.getElementsByClassName("overwrittenDel"));
	spans = document.getElementsByTagName("span");
	add = Array();
	metaMarks = Array.from(document.getElementsByTagName("metamark"));
	sic = Array.from(document.getElementsByTagName("sic"));
	corr = Array.from(document.getElementsByTagName("corr"));
	
	
	for (let i = 0; i < spans.length;i++){
		let x = spans[i].getAttribute("class");
	  if (x == "supraAdd" | x == "marginAdd" | x == "add" | x == "overwrittenAdd"){
		  add.push(spans[i])
	  }
	}
	notes = Array.from(document.getElementsByTagName("note"));
	
	del.forEach(hideElement);
	overwrittenDel.forEach(hideElement);
	add.forEach(removeStyling);
	notes.forEach(hideElement);
	metaMarks.forEach(hideElement);
	sic.forEach(hideElement);
	corr.forEach(showElement);
	
	reader = true;
}
