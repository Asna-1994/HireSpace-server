
import { ConnectionRequestUseCase } from "../Application2/usecases/ConnectionRequest/ConnectionRequestUseCase";
import { ConnectionRequestRepository } from "../Infrastructure2/persistance/repositories/ConnectionRequestRepository";
import { UserRepository } from "../Infrastructure2/persistance/repositories/UserRepository";
import { ConnectionRequestController } from "../Interface2/controller/ConnectionRequest/ConnectionRequestController";




const userRepository = new UserRepository()
const connectionRepository = new ConnectionRequestRepository()



const connectionRequestUseCase = new ConnectionRequestUseCase(connectionRepository,userRepository)

const connectionRequestController = new ConnectionRequestController(connectionRequestUseCase)



export  {connectionRequestController};
