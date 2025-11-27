using System;
using System.Collections.Generic;
using Domain.Model;

namespace Infrastructure.Repository
{
  public interface IUserRepository
  {
    User GetUserById(Guid user_id);
    User GetUserByEmail(String email, string role_name);
    User GetUserByPhone(String phone, string role_name);
    CreateUserResponse CreateUser(CreateUserRequest createUserRequest);
    bool ResetPassword(RequestResetPassword requestResetPassword);
    bool ChangePassword(RequestChangePassword requestChangePassword);
    UpdateUserResponse UpdateUser(User user);
    bool DeleteUser(List<Guid> ids);
  }
}
