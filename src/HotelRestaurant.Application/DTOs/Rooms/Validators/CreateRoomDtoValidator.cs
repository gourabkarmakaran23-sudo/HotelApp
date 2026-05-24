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
            .MaximumLength(10).WithMessage("Room Number cannot exceed 10 characters."); // Fixed

        RuleFor(x => x.RoomTypesId)
            .GreaterThan(0).WithMessage("Room Type Id must be greater than 0");

        RuleFor(x => x.FLoorNumber)
            .GreaterThan(0).WithMessage("Floor Number must be greater than 0");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required");
    }
}
}