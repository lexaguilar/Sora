using System;
using Microsoft.AspNetCore.Mvc;

namespace Sora.Extensions
{
    public static class ControllerExtensions
    {
        internal static AppUser GetAppUser(this Controller controller)
        {
            AppUser usr = new AppUser();
            //TODO Cargar desde los claims
            usr.AreaId = 1;
            return usr;
        }
    }
}