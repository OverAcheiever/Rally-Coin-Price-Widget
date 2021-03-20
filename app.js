let fieldData = {};
let old_price = 0;
let coin = "";
let color = '';
window.addEventListener("onWidgetLoad", function (obj) {
  let fieldData = obj["detail"]["fieldData"];
  coin = fieldData.creatorCoin;
  color = fieldData.borderColor;
  document.querySelector(".coin-name").innerHTML = coin;
  if (fieldData.imageSource == "custom" && fieldData.customImage !== "") {
    document.getElementById(
      "coin-image"
    ).style.backgroundImage = `url("${fieldData.customImage}")`;
  } else {
    Http = new XMLHttpRequest();

    Http.onreadystatechange = function () {
      if (Http.readyState == 4 && Http.status == 200) {
        let list = JSON.parse(Http.responseText);
        for (obj in list) {
          if (list[obj].coinSymbol == coin) {
            document.getElementById(
              "coin-image"
            ).style.backgroundImage = `url(${list[obj].coinImagePath})`;
            console.log(list[obj].coinImagePath);
          }
        }
      }
    };

    Http.open("GET", `https://api.rally.io/v1/creator_coins`);
    Http.send(null);
  }
});

function getPrice() {
  Http = new XMLHttpRequest();

  Http.onreadystatechange = function () {
    if (Http.readyState == 4 && Http.status == 200) {
      new_price = JSON.parse(Http.responseText).priceInUSD;
      console.log(new_price);
      document.querySelector(".price").innerHTML =
        "$" + new_price.toFixed({decimalPlaces});
      if (new_price > old_price) {
        anime({
          targets: ".background",
          keyframes: [
            { backgroundColor: "#06bf3d" },
            { backgroundColor: color , delay: 500 },
          ],
        });
        anime({
          targets: ".price",
          keyframes: [{ color: "#06bf3d" }, { color:  `#333`, delay: 500 }],
        });
      }
      if (old_price > new_price) {
        anime({
          targets: ".background",
          keyframes: [
            { backgroundColor: "#ff3636" },
            { backgroundColor: color, delay: 500 },
          ],
        });
        anime({
          targets: ".price",
          keyframes: [{ color: "#ff3636" }, { color: `#333`, delay: 500 }],
        });
      }

      if (new_price === old_price) {
        console.log("Price Unchanged");
      }
      old_price = new_price;
    }
  };

  Http.open("GET", `https://api.rally.io/v1/creator_coins/${coin}/price`);
  Http.send(null);
}

setInterval(getPrice, 5000);