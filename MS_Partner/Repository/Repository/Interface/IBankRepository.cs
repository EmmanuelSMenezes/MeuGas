using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using System;
using System.Collections.Generic;

namespace Infrastructure.Repository
{
    public interface IBankRepository
    {
        BankPartner CreateBank(CreateBankRequest bankRequest);
        BankPartner GetBankById(Guid partner_id);
        BankPartner UpdateBank(UpdateBankRequest bankRequest);
        BankPartner DeleteBank(Guid bank_details_id);
    }
}
