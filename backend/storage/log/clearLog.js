import fs from "fs";
import { getFailureLog } from "./deleteFile.js";
import path from "path";

const clearLog = async () => {
  const fiveDaysOld = Date.now() - 5 * 24 * 60 * 60 * 1000; // 5 days ago
  let clearCount = 0;
  let remainCount = 0;

  try {
    const log = await getFailureLog();

    // Keep only errors that are either unsolved OR solved within the last 5 days
    const storedErrors = log.deleteFiles.filter(
      (err) => !err.solved || new Date(err.solvedAt).getTime() >= fiveDaysOld
    );

    if (storedErrors.length === log.deleteFiles.length) return; // No changes, exit

    console.log(
      `Clearing log: ${log.deleteFiles.length} errors removed, ${storedErrors.length} remaining`
    );

    log.deleteFiles = storedErrors;

    fs.writeFileSync(
      path.resolve("storage/log/failures.json"),
      JSON.stringify(log, null, 2)
    );

    clearCount = log.deleteFiles.length - storedErrors.length;
    remainCount = storedErrors.length;
  } catch (error) {
    fs.appendFileSync(
      path.resolve("storage/log/tempError.log"),
      `${new Date().toISOString()} - ${error.stack}\n`
    );
  }

  return { clearCount, remainCount };
};

export default clearLog;
