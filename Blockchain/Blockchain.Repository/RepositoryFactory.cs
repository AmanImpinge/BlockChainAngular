using Blockchain.Core.Constants;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
using Blockchain.Repository.Areas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Repository
{
    public class RepositoryFactory
    {
        private Dictionary<string, RepositoryBase> _loadedRepositories = new Dictionary<string, RepositoryBase>();
        public RepositoryFactory()
        {

        }

        private T LoadRepository<T>() where T : RepositoryBase
        {
            Type myType = typeof(T);
            string name = myType.FullName;
            T repository = null;

            if (_loadedRepositories.ContainsKey(name))
            {
                repository = _loadedRepositories[name] as T;
            }

            if (repository == null)
            {

                repository = Activator.CreateInstance(myType) as T;
                _loadedRepositories.Add(name, repository);
            }

            return repository;
        }

        public LoginArea Login
        {
            get { return LoadRepository<LoginArea>(); }
        }

        public UserArea User
        {
            get { return LoadRepository<UserArea>(); }
        }

        public WorldArea World
        {
            get { return LoadRepository<WorldArea>(); }
        }

        public ActivityArea Activity
        {
            get { return LoadRepository<ActivityArea>(); }
        }
        public UserActivityArea UserActivity
        {
            get { return LoadRepository<UserActivityArea>(); }
        }


        public RewardArea Reward
        {
            get
            {
                return LoadRepository<RewardArea>();
            }
        }

        public ItemArea Item
        {
            get
            {
                return LoadRepository<ItemArea>();
            }
        }

        public TransactionsArea Transaction
        {
            get
            {
                return LoadRepository<TransactionsArea>();
            }
        }


        public BadgeArea Badge
        {
            get
            {
                return LoadRepository<BadgeArea>();
            }
        }

        public EventArea Event { get { return LoadRepository<EventArea>(); } }

        public PrivacyNotesArea PrivacyNotes { get { return LoadRepository<PrivacyNotesArea>(); } }
        public FAQArea FAQs { get { return LoadRepository<FAQArea>(); } }
    }

    public class RepositoryBase
    {
        public string SessionKey;

        protected GenericResponse<T> CreateResponse<T>(string status, T data, Error error = null) where T : class
        {
            GenericResponse<T> response = new GenericResponse<T>
            {
                Status = status,
                Data = data,
                Error = error
            };

            return response;
        }

        protected long GetLoginUserId()
        {
            BlockchainContext context = new BlockchainContext();
            var loggedInUser = context.UserLogins.FirstOrDefault(x => x.SessionId == SessionKey);

            return loggedInUser.UserId;
        }

        protected GenericResponse<T> CreateErrorResponse<T>(EnumUtils.StatusCode statusCode, string message) where T : class
        {
            GenericResponse<T> response = new GenericResponse<T>
            {
                Status = Messages.Fail,
                Error = new Error
                {
                    ErrorCode = Convert.ToInt32(statusCode),
                    Message = message
                }
            };

            return response;
        }
    }
}
