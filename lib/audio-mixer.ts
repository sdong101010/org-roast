import { execFile } from "child_process";
import { writeFile, readFile, unlink, access } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const BEAT_VOLUME = 0.3;
const FADE_IN_DURATION = 2;
const FADE_OUT_DURATION = 6;

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function mixWithBeat(voiceBuffer: Buffer): Promise<Buffer> {
  const beatPath = join(process.cwd(), "public", "beat.mp3");

  if (!(await fileExists(beatPath))) {
    return voiceBuffer;
  }

  const id = randomUUID();
  const tmp = tmpdir();
  const voicePath = join(tmp, `roast-voice-${id}.mp3`);
  const outputPath = join(tmp, `roast-mixed-${id}.mp3`);

  try {
    await writeFile(voicePath, voiceBuffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        "ffmpeg",
        [
          "-y",
          "-i", voicePath,
          "-i", beatPath,
          "-filter_complex",
          [
            `[1:a]atrim=0:60,asetpts=PTS-STARTPTS`,
            `volume=${BEAT_VOLUME}`,
            `afade=t=in:st=0:d=${FADE_IN_DURATION}`,
            `afade=t=out:st=54:d=${FADE_OUT_DURATION}[beat]`,
            `[0:a]volume=1.0[voice]`,
            `[beat][voice]amix=inputs=2:duration=shortest:dropout_transition=3`,
          ].join(","),
          "-b:a", "192k",
          outputPath,
        ],
        { timeout: 15000 },
        (error, _stdout, stderr) => {
          if (error) {
            console.error("ffmpeg stderr:", stderr);
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    return await readFile(outputPath);
  } finally {
    await Promise.allSettled([unlink(voicePath), unlink(outputPath)]);
  }
}
