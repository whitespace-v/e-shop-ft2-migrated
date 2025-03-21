'use client';
import s from './Header.module.scss';
import { Container } from '@/app/shared/components/UIKIT/Container/Container';
import { Logo } from '@/app/shared/icons/Logo';
import { WishList } from '@/app/shared/icons/WishList';
import { Cart } from '@/app/shared/icons/Cart';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Search } from '@/app/shared/icons/Search';
import { useSortStore } from '@/app/shared/core/providers/sortProvider';
import { useDebounceCallback } from '@/app/shared/hooks/useDebounceCallback';
import { useUserStore } from '@/app/shared/core/providers/userProvider';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/app/shared/hooks/useLocalStorage';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Link from 'next/link';
import { useFavoriteStore } from '@/app/shared/core/providers/favoriteProvider';
import { useBasketStore } from '@/app/shared/core/providers/basketProvider';
import { Trash2 } from 'lucide-react';

const Header = () => {
  const [value, setValue, removeValue] = useLocalStorage('token', '');
  const router = useRouter();
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);
  const { queryAction, query } = useSortStore(state => state);
  const { user_login, user_id, setUser } = useUserStore(state => state);
  const { favorites, triggerFavorite } = useFavoriteStore(state => state);
  const { basketItems, basketAction } = useBasketStore(state => state);
  const debounced = useDebounceCallback(queryAction, 500);

  useEffect(() => {
    console.log(query);
  }, [query]);

  const queryHandler = (q: string) => {
    if (q.length > 3) debounced(q);
  };

  const signoutHandler = () => {
    removeValue();
    setUser(0, '');
  };
  return (
    <header className={s.header}>
      <Container>
        <div className={s.header__content}>
          <Logo color="black" />
          <div className={s.search}>
            <div className={s.search__wrapper}>
              <Search className={cn(s.search__icon, isActiveInput && s.search__icon_active)} />
              <input
                onChange={e => queryHandler(e.currentTarget.value.trim())}
                onFocus={() => setIsActiveInput(true)}
                onBlur={() => setIsActiveInput(false)}
                type="text"
                className={s.search__input}
                placeholder={'Search'}
              />
            </div>
          </div>
          <div className={s.buttons}>
            <HoverCard>
              <HoverCardTrigger>
                <Link href={'/favorite'}>
                  <div className={s.buttons__item}>
                    <button className={s.buttons__btn}>
                      <WishList className={s.buttons__WishList} />
                    </button>
                    {favorites.length > 0 && (
                      <div className="rounded-full bg-red-500 p-1 flex items-center justify-center text-foreground-100 h-[24px] w-[24px]">
                        {favorites.length}
                      </div>
                    )}
                  </div>
                </Link>
              </HoverCardTrigger>
              {favorites.length > 0 ? (
                <HoverCardContent className="flex flex-col gap-2">
                  {favorites.map((f, idx) => (
                    <div key={idx} className="border border-gray-400 border-solid rounded-md flex justify-between">
                      <Link href={'/products/' + f}>{f}</Link>
                      <div onClick={() => void triggerFavorite(f)}>
                        <Trash2 />
                      </div>
                    </div>
                  ))}
                </HoverCardContent>
              ) : (
                <HoverCardContent>В избранных товаров нет :(</HoverCardContent>
              )}
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <Link href={'/basket'}>
                  <div className={s.buttons__item}>
                    <button className={cn(s.buttons__btn, s.btn_cart)}>
                      <Cart className={s.buttons__Cart} />
                    </button>
                    {basketItems.length > 0 && (
                      <div className="rounded-full bg-red-500 p-1 flex items-center justify-center text-foreground-100 h-[24px] w-[24px]">
                        {basketItems.length}
                      </div>
                    )}
                  </div>
                </Link>
              </HoverCardTrigger>
              {basketItems.length > 0 ? (
                <HoverCardContent>
                  {basketItems.map((i, idx) => (
                    <div key={idx} className="border border-gray-400 border-solid rounded-md flex justify-between">
                      <Link href={'/products/' + i}>{i}</Link>
                      <div onClick={() => void basketAction(i)}>
                        <Trash2 />
                      </div>
                    </div>
                  ))}
                </HoverCardContent>
              ) : (
                <HoverCardContent>В корзине товаров нет :(</HoverCardContent>
              )}
            </HoverCard>

            {user_id !== 0 ? (
              <div className="flex gap-4 items-center">
                <div>{user_login}</div>
                <div onClick={() => signoutHandler()}>Sign out</div>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <div onClick={() => router.push('/signin')}>Sign In</div>
                <div onClick={() => router.push('/signup')}>Sign Up</div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
