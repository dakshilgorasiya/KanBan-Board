using KanBanBoard.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KanBanBoard.DTO
{
    public class UserResponseDTO
    {
        public int UserId { get; set; }

        public string? UserName { get; set; }

        public string? Email { get; set; }

        public UserRole? Role { get; set; }
    }
}
