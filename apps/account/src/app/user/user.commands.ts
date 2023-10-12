import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@purple-udemy/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeUserInfo(
    @Body() { user, id }: AccountChangeProfile.Request,
  ): Promise<AccountChangeProfile.Response> {
    const existedUser = await this.userRepository.findUserById(id);
    if (!existedUser) {
      throw new Error('This user does not exist');
    }
    const userEntity = new UserEntity(existedUser).updateProfile(
      user.displayName,
    );
    await this.userRepository.updateUser(userEntity);
    return {};
  }
}
