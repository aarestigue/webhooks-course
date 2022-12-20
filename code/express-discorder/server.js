require("dotenv").config();
const express = require("express");
const axios = require("axios").default;

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => res.send(`
  <html>
    <head><title>Success today!</title></head>
    <body>
      <h1>You did it hubspot post!</h1>
      <img src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif" alt="Cool kid doing thumbs up" />
    </body>
  </html>
`));

app.post("/invoice-paid", (req, res) => {
  const dealId = req.body.data.object.customer_name;
  console.log('hubspot here!', dealId)
  const data = {
    "properties": {
      "invoice_paid": "True"
    } 
  };
  axios.patch(`${process.env.HUB_URL}/crm/v3/objects/deals/${dealId}`, data, {headers:{
      "Authorization": `Bearer ${process.env.HUBSPOT_TOKEN}`,
      "Content-Type": "application/json"
      }}
       )
    .then((hubspotResponse) => {

      console.log(`Success Hubspot! ${hubspotResponse}`);
      res.status(204).send();
    })
    .catch((err) => console.error(`Error sending to Discord: ${err}`));
});

app.use((error, req, res, next) => {
  res.status(500)
  res.send({error: error})
  console.error(error.stack)
  next(error)
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
