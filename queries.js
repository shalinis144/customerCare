const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: '12345',
  port: 5432,
})

var status;

module.exports.getUniqueIdForCaller= async (callerId,calledDid,calledDate) => {

  // [callerId, calledDid, calledDate,callStatus,agentId,agentNumber,startTime,endTime,voiceFile]
  const client= await pool.connect();
  const results= await pool.query('INSERT INTO callLog (callerid, calleddid, calleddate ) VALUES ($1,$2,$3)',[callerId, calledDid, calledDate]);

  if(results.rowCount==1)
  {
    const results= await pool.query('SELECT id FROM callLog WHERE callerid = $1 ORDER BY id DESC ',[callerId]);
    status='Id='+results.rows[0].id;
  }
  else
  {
    status="Does not exist";
  }
  return status;

}

module.exports.getAgentDetails= async () =>
{
    let agentDetails= await pool.query("SELECT agentid,agentnumber,agentname FROM masteragent WHERE agentstatus=1");
    if(agentDetails.rowCount==1)
    {
      status=agentDetails.rows[0].agentid+"="+agentDetails.rows[0].agentnumber;
    }
    else
    {
      status="VoiceMail";
    }
    return status;

}


module.exports.updateAgentStatus=async(agentid,uniqueid)=>
{
  let updateMain= await pool.query("UPDATE calllog SET agentid=$1 WHERE id=$2",[agentid,uniqueid]);
  console.log(updateMain);
  if(updateMain.rowCount==1){
    console.log("Updation Successful");

  }
  else {
    console.log("Updation Unsuccessful");
  }
  let updateAgent= await pool.query("UPDATE masteragent SET agentstatus=0 WHERE agentid=$1",[agentid]);
  console.log(updateAgent);
  if(updateAgent.rowCount==1){
    console.log("Updation Successful");
    return "Updation Successful";
  }
  else {
    console.log("Updation Unsuccessful");
    return "Updation Unsuccessful";
  }
}

module.exports.updateCallLog=async(callStatus,agentId,callStartTime,callEndTime,voiceLog,uniqueId)=>
{
  let updateAgent= await pool.query("UPDATE masteragent SET agentstatus=1 WHERE agentid=$1",[agentId]);
  if(updateAgent.rowCount==1){
    console.log("Updation successful");
  }
  else {
    console.log("Unsuccessful");
  }

  let update= await pool.query("UPDATE calllog SET callstatus=$1,agentid=$2,starttime=$3,endtime=$4,voicefile=$5 WHERE id=$6",[callStatus,agentId,callStartTime,callEndTime,voiceLog,uniqueId]);
  if(update.rowCount==1){
    return 1;
  } else {
      return 0;
  }

}
