console.log("Jello world!");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const lol = () => "lol";

const sleepyWork = async () => {
  console.log("I'm going to sleep for 1 second.");
  await sleep(1000);
  console.log("I woke up after 1 second.");
  await sleep(1000);
  console.log("Excecuting lol: ", lol());
};

const moreSleepy = () => {
  while (true) {
    sleepyWork();
  }
};

moreSleepy();
