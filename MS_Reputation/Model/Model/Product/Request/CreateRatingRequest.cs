using System;

namespace Domain.Model
{
    public class CreateRatingRequest
    {
        public Guid Rating_type_id { get; set; }
        public int Rating_value { get; set; }
        public string Note { get; set; }
        public Guid Branch_id { get; set; }
        public Guid Created_by { get; set; }
    }
}

