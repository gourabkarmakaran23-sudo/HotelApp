namespace HotelRestaurant.Core.Interfaces
{
    public interface IClientTransaction : IDisposable, IAsyncDisposable
    {
        Task CommitAsync(CancellationToken cancellationToken = default);
        Task RollbackAsync(CancellationToken cancellationToken = default);
    }
}