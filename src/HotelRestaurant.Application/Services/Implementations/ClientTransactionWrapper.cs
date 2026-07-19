using HotelRestaurant.Core.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace HotelRestaurant.Infrastructure.UnitOfWork
{
    public sealed class ClientTransactionWrapper : IClientTransaction
    {
        private readonly IDbContextTransaction _efTransaction;

        public ClientTransactionWrapper(IDbContextTransaction efTransaction)
        {
            _efTransaction = efTransaction ?? throw new ArgumentNullException(nameof(efTransaction));
        }

        public async Task CommitAsync(CancellationToken cancellationToken = default)
        {
            await _efTransaction.CommitAsync(cancellationToken);
        }

        public async Task RollbackAsync(CancellationToken cancellationToken = default)
        {
            await _efTransaction.RollbackAsync(cancellationToken);
        }

        public void Dispose() => _efTransaction.Dispose();

        public async ValueTask DisposeAsync() => await _efTransaction.DisposeAsync();
    }
}