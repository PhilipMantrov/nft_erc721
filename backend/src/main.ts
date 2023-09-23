import { getMicroservice } from "@common/build.factory";
import process from "process";
import { Logger } from "@nestjs/common";
import "@nomicfoundation/hardhat-ethers";

const microservices: Array<string> = process.argv.slice(2);

const logger: Logger = new Logger(`main.ts`);

async function bootstrap() {
  for await (const val of microservices) {
    logger.log(val);
    logger.log(process.env.npm_package_version);
    const app = await getMicroservice(val);
    await app.listen();
  }
}

bootstrap();
