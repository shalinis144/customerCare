const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./queries');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)


//To get the uniqueid when the callerId, calledId and calledDate are passed
app.post("/getID", async (req, res) => {

  var user = req.body;
  let value = await db.getUniqueIdForCaller(user.callerId, user.calledDid, user.calledDate);

  console.log(value);
  res.send(value);

});

// To retrieve the agent details when the agent is free
app.post('/getAgentDetails', async (req, res) => {
  let status = await db.getAgentDetails();
  res.send(status);
});

// Update the agent details(Make the status 0 which means busy)
// update the callLog with the agentid where the customer id is given
app.post('/updateAgentStatus', async (req, res) => {
  let status = await db.updateAgentStatus(req.body.agentid, req.body.uniqueid);
  res.send(status);
})

// update masteragent table where the agent status is 1 which means the agent is free
// update the callLog with the callStatus,starttime, etc..
app.post('/updateCallLog', async (req, res) => {
  let status = await db.updateCallLog(req.body.callstatus, req.body.agentid, req.body.starttime, req.body.endtime, req.body.voicefile, req.body.uniqueid);
  console.log(status);
  if (status == 1) {
    res.send("Rows have been updated");
  } else {
    res.send("Rows have not been updated");
  }
});





app.listen(3000, () => {
  console.log("Server started at port 3000");
});
