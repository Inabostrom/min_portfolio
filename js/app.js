import { cdnUrl, projectID } from "./env.js";
import { handleImage, handleParagraphs } from "./utils.js";

function init() {
  const URL = window.location.href;
  const urlString = window.location.search;
  const paramsUrl = new URLSearchParams(urlString);
  const pageValue = paramsUrl.get("page");
  console.log(pageValue);

  const burgerIcon = document.querySelector(".burger-icon");
  const mobileNav = document.querySelector(".mobile-nav");
  burgerIcon.addEventListener("click", () => {
    mobileNav.classList.toggle("mobile-nav-hide");
    burgerIcon.classList.toggle("burger");
    burgerIcon.classList.toggle("closemobilemenu");
  });

  if (pageValue === null) {
    getPosts();
  } else {
    getPost(pageValue);
  }

  getAuthors();
}

async function getPost(pageValue) {
  const project = document.querySelector(".projectside");
  const post =
    await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
    [slug.current == "${pageValue}"]
    `);
  console.log(post);

  const { result } = await post.json();
  console.log("JSON from project:")
  console.log(result);
  // her legger vi inn project variabel ferdig <img> element returnert fra støtte funksjon som håndtere bilder
  project.append(handleImage(result[0].mainImage.asset._ref, 400));
  const title = document.createElement("h1");
  title.innerText = result[0].title;
  project.append(title);
  project.append(handleParagraphs(result[0].body));
  await getColorSections(result[0].colors);
}


async function getColorSections(colorsSchemaList) {
  let colorSection = document.querySelector(".colors");
  console.log(colorSection);


  colorsSchemaList.forEach(async element => {
    let colorSchema2 = await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
    [_id == '${element._ref}']`);
    const { result } = await colorSchema2.json();
  
    console.log("info:");
    console.log(result);
    //console.log(element._ref);

    let divElement = document.createElement("div");
    divElement.classList.add("color-element");

    if(result[0].title != null){
      let headerElement = document.createElement("p");
      headerElement.classList.add("color-sub-header");
      headerElement.textContent = result[0].title;
      divElement.append(headerElement);
    }

    let bodyElement = GetPValuesOfBody(result[0].body)

    divElement.append(bodyElement);
    let imageElement = document.createElement("div");
    imageElement.classList.add("color-image");
    if(result[0].image != null){
      imageElement.append(handleImage(result[0].image.asset._ref, 400, "color-image-inner"))
      divElement.append(imageElement);
    }
    colorSection.appendChild(divElement);

  });
}

function GetPValuesOfBody(body) {
  let contentBox = document.createElement("div");

  if(body != null){
    body.forEach((bodyElement) => {
      let contentPelement = document.createElement("p");
      contentPelement.classList.add("styleForP");
     
      bodyElement.children.forEach((child) => {
        
        if(child.marks.includes("strong")){
          let strongElement = document.createElement("b")
          strongElement.textContent = child.text;
          contentPElement.appendChild(strongElement);
        }else {
          let spanElement = document.createElement("span");
          spanElement.textContent += child.text;
          contentPElement.appendChild(spanElement);
        }
      });

      contentBox.appendChild(contentPElement);
    });
    
  }
  return contentBox;
}


async function getAuthors() {
  const authors =
    await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
    [_type == "author"]
    `);




  const { result } = await authors.json();

  var fileResult;
  const authorFiles = await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
  [_type == 'author']
  {'my_filesURL': my_files.asset->url}
  `).then(response => response.json())
  .then(jsondata => {
    console.log(jsondata);
    fileResult = jsondata;
  } );

  //const { fileResult } = await authorFiles.json();
  //console.log(fileResult);

  // legger til kontakt på index.html
  let contactElement = document.getElementById("contact");
  if (contactElement !== null) {
    /*<section>
           <img src="img">
           <div>
             <p>name</p>
             <p>phone</p>
             <p>email</p>
           </div>
         </section>
        */
    contactElement.append(
      handleImage(result[0].image.asset._ref, 400, "om-meg-img")
    ); //Setter inn størrelse for bildet

    const contactDivElement = document.createElement("div");

    const nameElement = document.createElement("p");
    nameElement.innerText = result[0].name;

    const phoneElement = document.createElement("p");
    phoneElement.innerText = result[0].phone;

    const emailElement = document.createElement("p");
    emailElement.innerText = result[0].email;



    emailElement.innerText = result[0].email;
    contactDivElement.append(nameElement);
    contactDivElement.append(phoneElement);
    contactDivElement.append(emailElement);
    contactElement.append(contactDivElement);
    //FERDIG MED contact

    //Start bio tekst index.html
    // legger til tekst om meg
    let aboutMeElement = document.getElementById("about-me"); //Henter ut class= about-me fra html, teksten fra Sanity skal ligge i

    const shortIntroElement = document.createElement("div"); //Oppretter et div element
    shortIntroElement.classList.add("bio-text"); //Legger til class som heter bio-text
    result[0].shortIntro.forEach((bioValue) => {
      //Henter ut data fra Json, Sanity. 
      let pElement = document.createElement("p"); //Forhver biovalue blir det et <p>tekst</p> element i html
      pElement.innerText = bioValue.children[0].text; //legger text inn i p elementet. 
      shortIntroElement.append(pElement); //legger p elementet in i div som er opprettet før foreach.
    });

    aboutMeElement.append(shortIntroElement); //Legger div elementet inn i div med about-me id, i selve index.html
  }

  //insight fra sanity

  let insightElement = document.getElementById("insight");
  if (insightElement !== null) {

  //  insightElement.append(
  //     handleImage(result[0].image.asset._ref, 400, "om-meg-img")
  //   ); //Setter inn størrelse for bildet

  }




  
  // legger til tekst på aboutme.html
  const myBioElement = document.getElementById("my-bio");
  if (myBioElement !== null) {

    myBioElement.classList.add("bio-text2");
    result[0].bio.forEach((bioValue) => {
      let p2Element = document.createElement("p");
      p2Element.innerText = bioValue.children[0].text;
      myBioElement.append(p2Element);
    });

  }
}

async function getPosts() {
  const posts =
    await fetch(`https://${projectID}.api.sanity.io/v1/data/query/production?query=*
    [_type == "post"]
    `);
  const { result } = await posts.json();

  // legger til prosjektene
  const projectList = document.querySelector(".projectlist");

  if (projectList !== null) {
    result.forEach((post) => {

      const projectOuterBlock = document.createElement("div");
      projectOuterBlock.classList.add("outer-project-element");
    
      const projectTitle = document.createElement("h2");
      projectTitle.classList.add("project-title");
      projectTitle.innerText = post.title;

      projectOuterBlock.append(projectTitle);

      const projectBlock = document.createElement("a");
      projectBlock.classList.add("project");
      
      projectBlock.setAttribute(
        "href",
        `./pages/${post.slug.current}.html`
      );

      const readMore = document.createElement("b");
      readMore.classList.add("project-read-more");
      readMore.innerText = "Les mer";


      projectBlock.append(readMore);
      const projectMask = document.createElement("div");
      projectMask.classList.add("project-mask");
      projectBlock.append(projectMask);

      const projectCover = document.createElement("img");

      const cover = post.mainImage.asset._ref.split("-");
      projectCover.setAttribute(
        "src",
        `${cdnUrl}${cover[1]}-${cover[2]}.${cover[3]}?h=400`
      );
      projectCover.classList.add("project-cover");
      projectBlock.append(projectCover);
      projectOuterBlock.append(projectBlock);
      projectList.append(projectOuterBlock);
      console.log(projectOuterBlock);
    });

    console.log(result);
  }
}

init();
