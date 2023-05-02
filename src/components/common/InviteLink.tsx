import React, { memo, useCallback, useMemo } from '../../lib/teact/teact';
import { getActions } from '../../global';

import type { FC } from '../../lib/teact/teact';

import { copyTextToClipboard } from '../../util/clipboard';
import buildClassName from '../../util/buildClassName';
import useLang from '../../hooks/useLang';
import useAppLayout from '../../hooks/useAppLayout';

import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';
import Button from '../ui/Button';

import styles from './InviteLink.module.scss';

type OwnProps = {
  title?: string;
  inviteLink: string;
  onRevoke?: VoidFunction;
};

const InviteLink: FC<OwnProps> = ({
  title,
  inviteLink,
  onRevoke,
}) => {
  const lang = useLang();
  const { showNotification, openChatWithDraft } = getActions();

  const { isMobile } = useAppLayout();

  const copyLink = useCallback((link: string) => {
    copyTextToClipboard(link);
    showNotification({
      message: lang('LinkCopied'),
    });
  }, [lang]);

  const handleCopyPrimaryClicked = useCallback(() => {
    copyLink(inviteLink);
  }, [copyLink, inviteLink]);

  const handleShare = useCallback(() => {
    openChatWithDraft({ text: inviteLink });
  }, [inviteLink]);

  const PrimaryLinkMenuButton: FC<{ onTrigger: () => void; isOpen?: boolean }> = useMemo(() => {
    return ({ onTrigger, isOpen }) => (
      <Button
        round
        ripple={!isMobile}
        size="smaller"
        color="translucent"
        className={isOpen ? 'active' : ''}
        onClick={onTrigger}
        ariaLabel="Actions"
      >
        <i className="icon icon-more" />
      </Button>
    );
  }, [isMobile]);

  return (
    <div className="settings-item">
      <p className="text-muted">
        {lang(title || 'InviteLink.InviteLink')}
      </p>
      <div className={styles.primaryLink}>
        <input
          className={buildClassName('form-control', styles.input)}
          value={inviteLink}
          readOnly
          onClick={handleCopyPrimaryClicked}
        />
        <DropdownMenu
          className={styles.moreMenu}
          trigger={PrimaryLinkMenuButton}
          positionX="right"
        >
          <MenuItem icon="copy" onClick={handleCopyPrimaryClicked}>{lang('Copy')}</MenuItem>
          {onRevoke && (
            <MenuItem icon="delete" onClick={onRevoke} destructive>{lang('RevokeButton')}</MenuItem>
          )}
        </DropdownMenu>
      </div>
      <div className={styles.buttons}>
        <Button onClick={handleCopyPrimaryClicked} className={styles.button}>
          {lang('FolderLinkScreen.LinkActionCopy')}
        </Button>
        <Button onClick={handleShare} className={styles.button}>
          {lang('FolderLinkScreen.LinkActionShare')}
        </Button>
      </div>
    </div>
  );
};

export default memo(InviteLink);