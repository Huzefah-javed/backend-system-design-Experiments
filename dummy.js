let trip = true;
let key = true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const redisTripper = async (trip) => {
  if (trip) {
    console.log("A");
    let name = true;
    if (name) return true;
    return false;
  } else {
    console.log("B");
    // key = false;
  }
};
while (key) {
  await sleep(500);
  let nigga = await redisTripper(trip);
  if (nigga) break;
  trip = !trip;
}
