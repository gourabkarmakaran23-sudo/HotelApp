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
            RuleFor(x=> x.Id)
                .GreaterThan(0).WithMessage("Invalid room ID.");
            RuleFor(x => x.RoomNumber)
                .NotEmpty().WithMessage("Room number is required.")
                .MaximumLength(10).WithMessage("Room number cannot exceed 10 characters.");

            RuleFor(x => x.RoomTypeId)
                .GreaterThan(0).WithMessage("Room type ID must be greater than 0.");

            RuleFor(x => x.FLoorNumber)
                .GreaterThanOrEqualTo(0).WithMessage("Floor number cannot be negative.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.FLoorNumber)
            .GreaterThanOrEqualTo(0).WithMessage("Floor Number must be greater than or equal to 0")    
            .LessThanOrEqualTo(100).WithMessage("Floor Number must be less than or equal to 100"); 

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must be less than or equal to 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));    
        }
    }
}