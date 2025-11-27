using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Microsoft.CodeAnalysis.Operations;
using System;
using System.Collections.Generic;

namespace Application.Service
{
    public interface IBankService
    {
        BankPartner CreateBank(CreateBankRequest bankRequest, string token);
        BankPartner GetBankById(Guid partner_id);
        BankPartner UpdateBank(UpdateBankRequest bankRequest, string token);
        BankPartner DeleteBank(Guid bank_details_id);
    }
}
