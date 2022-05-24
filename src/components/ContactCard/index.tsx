import { FC, MouseEvent, useState} from 'react';
import { Avatar, Box, Divider, Popover } from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Account } from '../../interfaces';
import useContactCardStyles from './index.style';

interface IContactCardProps {
  contact: Account.SimpleAccountDto;
}

const ContactCard: FC<IContactCardProps> = ({
  contact
}) => {

  const classes = useContactCardStyles();

  const [ anchorEl, setAnchorEl ] = useState<HTMLElement|null>(null);
  const open = Boolean(anchorEl);

  const getDelegateCharacter = (name: string) => {
    if (!name) {
      return '';
    }
    const words = name.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.length > 0) {
      return lastWord[0];
    }
    if (name.length > 0) {
      return name[0];
    }
    return '';
  };

  const handleHover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box 
      aria-describedby={contact.id}
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      className={classes.container}
      onMouseEnter={handleHover}
      onMouseLeave={handleClose}
    >
      <Avatar src={contact.photo} alt={contact.name}>{getDelegateCharacter(contact.name || '')}</Avatar>
      <Popover
        id={contact.id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.card}>
          <div className={classes.basicInfo}>
            <Avatar className={classes.avatar} src={contact.photo} alt={contact.name}>{getDelegateCharacter(contact.name || '')}</Avatar>
            <div className={classes.basicInfoText}>
              <div className={classes.basicInfoTextRow}>
                <p className={classes.name}>{contact.name}</p>
              </div>
              {
                contact.isStudent && (
                <div className={classes.basicInfoTextRow}>
                  <span className={classes.position}>Học sinh</span>
                </div>
                )
              }
              {
                contact.isTeacher && (
                  <div className={classes.basicInfoTextRow}>
                    <span className={classes.position}>Giáo viên</span>
                  </div>
                  )
              }
              <div className={classes.basicInfoTextRow}>
                <span className={classes.position}>{contact.classDisplayName}</span>
              </div>
            </div>
          </div>
          <Divider />
          <div className={classes.contact}>
            <div className={classes.contactRowInfo}>
              <PhoneIcon fontSize="small" />
              <span className={classes.position}>{contact.phoneNumber}</span>
            </div>
            <div className={classes.contactRowInfo}>
              <MailOutlineIcon fontSize="small" />
              <span className={classes.position}>{contact.email}</span>
            </div>
          </div>
        </div>
      </Popover>
    </Box>
  );
};

export default ContactCard;