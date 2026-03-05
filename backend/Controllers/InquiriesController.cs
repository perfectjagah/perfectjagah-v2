using Microsoft.AspNetCore.Mvc;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Controllers;

/// <summary>Public inquiry submission endpoint.</summary>
[ApiController]
[Route("api/inquiries")]
public class InquiriesController : ControllerBase
{
    private readonly IInquiryRepository _inquiries;

    public InquiriesController(IInquiryRepository inquiries) => _inquiries = inquiries;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateInquiryDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var inquiry = new Inquiry
        {
            PropertyId = dto.PropertyId,
            Name       = dto.Name,
            Email      = dto.Email,
            Phone      = dto.Phone,
            Message    = dto.Message
        };

        await _inquiries.CreateAsync(inquiry);
        return Ok(new { message = "Inquiry submitted successfully." });
    }
}
