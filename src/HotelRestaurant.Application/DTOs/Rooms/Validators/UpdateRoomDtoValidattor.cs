using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace HotelRestaurant.Application.DTOs.Rooms.Validators
{
    public class UpdateRoomDtoValidattor:AbstractValidator<UpdateRoomDto>
    {
        public UpdateRoomDtoValidattor()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0");

        RuleFor(x => x.RoomNumber)
            .NotEmpty().WithMessage("Room Number is required")
            .MaximumLength(50).WithMessage("Room Number cannot exceed 50 characters."); // Fixed

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