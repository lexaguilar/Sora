using System;
using Sora.ViewModel;

namespace Sora
{
    interface IModelValidation<T> where T : class
    {
        ModelValidationSource<T> validate();
    }    
}