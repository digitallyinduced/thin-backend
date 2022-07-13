import { DataSubscription, ensureIsUser, getCurrentUserId, initAuth, query, QueryBuilder, User, UUID, type TableName } from 'thin-backend';
import { onMounted, onUnmounted, ref, computed, provide, watch, type Ref, defineComponent, inject, watchEffect } from 'vue';

// To avoid too many loading spinners when going backwards and forwards
// between pages, we cache the result of queries so we can already showing
// some data directly after a page transition. The data might be a bit
// outdated, but it will directly be overriden with the latest server state
// once it has arrived.
const recordsCache = new Map();

const AuthCompletedContext = Symbol('AuthCompletedContext');


/**
 * Returns the result of the current query in real-time. Returns `null` while the data is still being fetched from the server.
 * @example
 * const messages = useQuery(query('messages').orderBy('createdAt'));
 */
export function useQuery<table extends TableName, result>(queryBuilder: QueryBuilder<table, result>): Ref<Array<result> | null> {
    const authCompleted: Ref<boolean> = inject(AuthCompletedContext, ref(true));
    const strinigifiedQuery = JSON.stringify(queryBuilder.query);
    const cachedRecords = recordsCache.get(strinigifiedQuery);
    const records = ref(cachedRecords === undefined ? null : cachedRecords);
    let dataSubscription = null;

    const init = () => {
      dataSubscription = new DataSubscription(queryBuilder.query);
      dataSubscription.createOnServer();

      let unsubscribeCallback = dataSubscription.subscribe(updatedRecords => {
          records.value = updatedRecords;

          // Update the cache whenever the records change
          recordsCache.set(strinigifiedQuery, records);
      });

      onUnmounted(unsubscribeCallback);
  };

    if (authCompleted.value) {
      console.log('auth done, waiting for component mount');
      onMounted(init);
    } else {
      watch(authCompleted, init);
      console.log('auth not done, waiting for auth');
    }

    return records;
}

/**
 * A version of `useQuery` when you only want to fetch a single record.
 * 
 * Automatically adds a `.limit(1)` to the query and returns the single result instead of a list.
 * 
 * @example
 * const message = useQuerySingleresult(query('messages').filterWhere('id', '1f290b39-c6d1-4dff-8404-0581f470253c'));
 */
export function useQuerySingleResult<table extends TableName, result>(queryBuilder: QueryBuilder<table, result>): Ref<result | null> {
    const result = useQuery(queryBuilder.limit(1));
    return computed(() => result.value === null ? null : result.value[0])
}

export function useCurrentUserId(): Ref<UUID | null> {
    const authCompleted: Ref<boolean> = inject(AuthCompletedContext, ref(true));
    const userIdRef: Ref<UUID | null> = ref(null);
    if (authCompleted.value) {
        userIdRef.value = getCurrentUserId();
    } else {
        watch(authCompleted, () => {
            userIdRef.value = getCurrentUserId();
        });
    }
    return userIdRef;
}

export function useIsLoggedIn(): Ref<boolean | null> {
    const userId = useCurrentUserId();
    return computed(() => userId.value !== null);
}

export function useCurrentUser(): Ref<User | null> {
    const authCompleted: Ref<boolean> = inject(AuthCompletedContext, ref(true));

    const records: Ref<User[] | null> = ref(null);
    let dataSubscription = null;

    const init = () => {
        const queryBuilder = query('users').where('id', getCurrentUserId());
        const strinigifiedQuery = JSON.stringify(queryBuilder.query);
        dataSubscription = new DataSubscription(queryBuilder.query);
        dataSubscription.createOnServer();

        let unsubscribeCallback = dataSubscription.subscribe(updatedRecords => {
            records.value = updatedRecords;

            // Update the cache whenever the records change
            recordsCache.set(strinigifiedQuery, records);
        });

        onUnmounted(unsubscribeCallback);
    };

    if (authCompleted.value) {
        console.log('auth done, waiting for component mount');
        onMounted(init);
    } else {
        watch(authCompleted, init);
        console.log('auth not done, waiting for auth');
    }

    return computed(() => records.value ? records.value[0] : null);
}

export const ThinBackend = defineComponent({
    props: {
      requireLogin: Boolean
    },
    setup(props) {
        const authCompleted = ref(false);
        (props.requireLogin ? ensureIsUser : initAuth)().then(() => authCompleted.value = true);
        provide(AuthCompletedContext, authCompleted);
    },
    render() {
        // @ts-expect-error
        return this.$slots.default();
    }
})