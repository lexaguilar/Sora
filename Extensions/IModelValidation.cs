using System;
using Sora.ViewModel;

namespace Sora
{
    interface IModelValidation<T> where T : class
    {
        ModelValidation validate();
    }

    public static class ModelValidationExtensions
    {
        internal static ModelValidation AsOk(this ModelValidation modelValidation)
        {
            return new ModelValidation
            {
                IsValid = true
            };
        }

        internal static ModelValidation AsError(this ModelValidation modelValidation, string error)
        {
            return new ModelValidation
            {
                IsValid = false,
                Error = error
            };
        }
    }
}