const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("送信されました");
});
const item = document.querySelector(".item");
item.classList.add("active");
item.style.color = " blue";
