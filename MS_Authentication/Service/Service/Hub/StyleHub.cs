using System;
using System.Threading.Tasks;
using Domain.Model;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace Application.Service
{
    public class StyleHub : Hub
    {
        private readonly ISettingsService _service;
        private readonly ILogger _logger;
        private Guid GroupAdmin_id;
        public StyleHub(ISettingsService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        public async Task RefreshStyle(Guid admin_id, StylePartnerResponse stylePartnerResponse, StyleConsumer styleConsumerResponse)
        {
            GroupAdmin_id = admin_id;
            await Clients.Group(admin_id.ToString()).SendAsync("RefreshStyle", stylePartnerResponse, styleConsumerResponse);
        }

        public async Task JoinCommunicationStyle()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "e92f9c8d-3665-49bb-a1a3-2658e9b9361e");
        }

    }
}