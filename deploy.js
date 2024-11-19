async function main() {
    const ProductAuth = await ethers.getContractFactory("ProductAuth");
    const productAuth = await ProductAuth.deploy();
    await productAuth.deployed();
    console.log("ProductAuth deployed to:", productAuth.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  