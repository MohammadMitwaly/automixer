const { exec } = require("child_process");
const { unlinkSync } = require("node:fs");

function createFfmpegCommand(tracks, output) {
  let inputs = "";
  let filterComplex = "";
  let numTracks = tracks.length - 1;

  // Add inputs
  tracks.forEach((track, _index) => {
    inputs += `-i ${track} `;
  });

  // Build the filter complex
  // FFMPEG CLI explained: https:/  /chatgpt.com/share/1af1baaa-8708-478d-aede-a6e3632b3830
  filterComplex += `[0][1]acrossfade=d=10:c1=tri:c2=tri[a01]`;
  for (let i = 2; i < numTracks; i++) {
    filterComplex += `;[a0${i - 1}][${i}]acrossfade=d=10:c1=tri:c2=tri[a0${i}]`;
  }
  filterComplex += `;[a0${
    numTracks - 1
  }][${numTracks}]acrossfade=d=10:c1=tri:c2=tri[out]`;

  // Final ffmpeg command
  const ffmpegCommand = `ffmpeg ${inputs} -filter_complex "${filterComplex}" -map "[out]" ${output}`;

  return ffmpegCommand;
}

function executeFfmpegCommand(tracks, output) {
  const command = createFfmpegCommand(tracks, output);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ffmpeg command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`ffmpeg stderr: ${stderr}`);
      return;
    }
    console.log(`ffmpeg stdout: ${stdout}`);
  });
}

// The order of the tracks here will determine the order in the final output
const inputTracks = [
  "track1.mp3",
  "track2.mp3",
  "track3.mp3",
  "track4.mp3",
  "track5.mp3",
];
const outputTrack = "out.mp3";

// Deleting the previous output if it exists
try {
  unlinkSync(outputTrack);
  console.log(`successfully deleted ${outputTrack}`);
} catch (err) {
  // handle the error
  console.log(`${outputTrack} does not exist`);
}

executeFfmpegCommand(inputTracks, outputTrack);