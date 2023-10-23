import {
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
} from '@purple-udemy/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public addCourse(courseId: string) {
    const exist = this.courses.find((c) => c.courseId === courseId); //was c._id in udemy
    if (exist) {
      throw new Error('Course is already exist');
    }
    this.courses.push({
      courseId,
      purchaseState: PurchaseState.Started,
    });
  }

  public deleteCourse(courseId: string) {
    this.courses = this.courses.filter((c) => c.courseId !== courseId);
  }

  public updateCourseState(courseId: string, state: PurchaseState) {
    this.courses = this.courses.map((c) => {
      if (c.courseId === courseId) {
        c.purchaseState = state;
      }
      return c;
    });
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    };
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName) {
    this.displayName = displayName;
    return this;
  }
}
