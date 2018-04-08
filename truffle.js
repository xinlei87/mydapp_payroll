module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1:7545",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
