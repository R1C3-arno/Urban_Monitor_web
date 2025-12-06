import ImageModal from "../../../shared/Components/UI/ImageModal/ImageModal.jsx";

const ImageLayout_Left = ({
                         open,
                         onClose,
                         images,
                         index,
                         onPrev,
                         onNext,
                         title,
                         description,
                         rightTitle,
                         rightContent,
                         footer,
                     }) => {
    return (
        <ImageModal
            isOpen={open}
            onClose={onClose}
            images={images}
            index={index}
            onPrev={onPrev}
            onNext={onNext}
            title={title}
            description={description}
            rightTitle={rightTitle}
            rightContent={rightContent}
            footer={footer}
        />
    );
};

export default ImageLayout_Left;