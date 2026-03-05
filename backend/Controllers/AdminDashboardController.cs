using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/dashboard")]
public class AdminDashboardController : ControllerBase
{
    private readonly IPropertyRepository _props;
    private readonly IInquiryRepository  _inquiries;

    public AdminDashboardController(IPropertyRepository props, IInquiryRepository inquiries)
    {
        _props     = props;
        _inquiries = inquiries;
    }

    [HttpGet]
    public async Task<IActionResult> Stats()
    {
        var (totalProps, activeProps)        = await _props.GetCountsAsync();
        var (totalInquiries, newInquiries)   = await _inquiries.GetCountsAsync();
        var recent                           = await _inquiries.GetRecentAsync(5);

        return Ok(new DashboardStatsDto(
            totalProps, activeProps,
            totalInquiries, newInquiries,
            recent
        ));
    }
}
