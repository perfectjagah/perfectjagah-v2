using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/inquiries")]
public class AdminInquiriesController : ControllerBase
{
    private readonly IInquiryRepository _inquiries;

    public AdminInquiriesController(IInquiryRepository inquiries) => _inquiries = inquiries;

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int? propertyId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        page     = Math.Max(page, 1);
        var result = await _inquiries.GetPagedAsync(propertyId, page, pageSize);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateInquiryDto dto)
    {
        var inquiry = await _inquiries.GetEntityAsync(id);
        if (inquiry is null) return NotFound();

        if (dto.Status is not null)
            inquiry.Status = dto.Status;

        await _inquiries.UpdateAsync(inquiry);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _inquiries.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
