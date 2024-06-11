module.exports = {
  apps: [
    {
      name: "callcenter",
      script: "bin/server.js",
      error_file:
        "/u01/oracle/nodejs/logs/" +
        process.env.INSTANCE_NAME +
        "/" +
        process.env.INSTANCE_NAME +
        ".error.log",
      out_file:
        "/u01/oracle/nodejs/logs/" +
        process.env.INSTANCE_NAME +
        "/" +
        process.env.INSTANCE_NAME +
        ".out.log",
      instances: "max",
      exec_mode: "cluster",
      watch: true,
      args: ["--color"],
      merge_logs: true,
      max_size: "1M",
      workerInterval: 60,
      rotateInterval: "0 0 * * 4",
      retain: 1,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_PATH: "./src",
        NODE_ENV: "production",
      },
      env_dev: {
        NODE_ENV: "development",
        LOG_LEVEL: "info",
      },
      env_qc: {
        NODE_ENV: "qc",
        LOG_LEVEL: "debug",
      },
      env_reporting: {
        NODE_ENV: "reporting",
        LOG_LEVEL: "debug",
      },
      env_sit: {
        NODE_ENV: "sit",
        LOG_LEVEL: "info",
      },
      env_qa: {
        NODE_ENV: "qa",
        LOG_LEVEL: "debug",
      },
      env_qa2: {
        NODE_ENV: "qa2",
        LOG_LEVEL: "debug",
      },
      env_qa3: {
        NODE_ENV: "qa3",
        LOG_LEVEL: "debug",
      },
      env_prod: {
        NODE_ENV: "production",
        LOG_LEVEL: "info",
      },
    },
  ],
};
