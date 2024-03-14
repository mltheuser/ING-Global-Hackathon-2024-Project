import React, { useState } from 'react';
import {
    WhatsappShareButton,
    TelegramShareButton,
    EmailShareButton,
    LinkedinShareButton,
    FacebookMessengerShareButton
    // TODO: integrate the remaining options:
    // GabShareButton,
    // HatenaShareButton,
    // InstapaperShareButton,
    // LineShareButton,
    // LivejournalShareButton,
    // MailruShareButton,
    // OKShareButton,
    // PinterestShareButton,
    // PocketShareButton,
    // RedditShareButton,
    // TumblrShareButton,
    // TwitterShareButton,
    // ViberShareButton,
    // VKShareButton,
    // WorkplaceShareButton,
  } from "react-share";
  import {
    EmailIcon,
    FacebookMessengerIcon,
    LinkedinIcon,
    TelegramIcon,
    WhatsappIcon,
  } from "react-share";

import './ShareLink.css';
  

function ShareLink(props) {
    const [uuid, setUuid] = useState(() => props.sharingLink);

    const getLink = () => {
        // todo: update to actual link
        return "http://localhost:3000/contribute/" + uuid + "/"
    }

    const getShareOneliner = () => {
        return "Hi there, sharing the link to settle our latest expenses. Please click here to make your payment: " + getLink() + ". Thanks!"
    }
    

    const getTitle = () => {
        "Settlement payment required"
    }

    const copyLink = () => {
        console.log("Hi!")
        navigator.clipboard.writeText(getLink())
        setLinkCopied(true)
    }
  
    const [linkCopied, setLinkCopied] = useState(() => false);
    const getCopyButtonText = () => {
        if (linkCopied) {
            return "Link copied to clipboard!"
        } else {
            return getLink();
        }
    }
    return (
        <div className='share-link'>
            <div className="link">
                <h3>Share the following link: </h3>
                <button className="copy-link" onClick={copyLink}>
                    {getCopyButtonText()}
                </button>
            </div>


            <div className="shareButtons">
                <div className="share Demo__some-network">
                    <WhatsappShareButton
                        url={getShareOneliner()}
                        title={getTitle()}
                        separator=":: "
                        className="Demo__some-network__share-button"
                    >
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>
                <div className="share Demo__some-network">
                    <FacebookMessengerShareButton
                        url={getShareOneliner()}
                        appId="521270401588372"
                        className="Demo__some-network__share-button"
                    >
                        <FacebookMessengerIcon size={32} round />
                    </FacebookMessengerShareButton>
                </div>
                <div className="share Demo__some-network">
                    <EmailShareButton
                        url={getLink()}
                        subject={getTitle()}
                        body={getShareOneliner()}
                        className="Demo__some-network__share-button"
                    >
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </div>

                <div className="share Demo__some-network">
                    <LinkedinShareButton 
                        url={getLink()} 
                        className="Demo__some-network__share-button">
                    <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
                <div className="share Demo__some-network">
                    <TelegramShareButton
                    url={getShareOneliner()}
                    title={getTitle()}
                    className="Demo__some-network__share-button"
                    >
                    <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>
          </div>
    </div>
    )
}

export default ShareLink