using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Rooms.Validators
{
   using FluentValidation;

public class CreateRoomDtoValidator
    : AbstractValidator<CreateRoomDto>
{
    public CreateRoomDtoValidator()
    {
        RuleFor(x => x.RoomNumber)
            .NotEmpty().WithMessage("Room Number is required")
            .MinimumLength(10).WithMessage("Room Number must be at least 10 characters long");

        RuleFor(x => x.RoomTypeId)
            .GreaterThan(0).WithMessage("Room Type Id must be greater than 0");

        RuleFor(x => x.FLoorNumber)
            .GreaterThanOrEqualTo(0).WithMessage("Floor Number must be greater than or equal to 0")    
            .LessThanOrEqualTo(100).WithMessage("Floor Number must be less than or equal to 100"); 

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must be less than or equal to 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));    

    }
}
}